import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertSignatorySchema, insertCertificationInquirySchema, lineItemSchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripe";
import { z } from "zod";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const password = req.headers['x-admin-password'] as string;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!password || !sessionSecret || password !== sessionSecret) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

const createInvoiceBodySchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientOrganization: z.string().optional().nullable(),
  lineItems: z.array(lineItemSchema).min(1),
  taxRate: z.number().min(0).default(0),
  dueDate: z.string(),
  notes: z.string().optional().nullable(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const existingConfig = await storage.getConfig();
  if (!existingConfig) {
    await storage.createConfig({ title: "My Simple Site" });
  }

  app.get(api.config.get.path, async (req, res) => {
    const config = await storage.getConfig();
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    res.json(config);
  });

  app.get("/api/signatories", async (req, res) => {
    const allSignatories = await storage.getSignatories();
    const count = allSignatories.length;
    res.json({ signatories: allSignatories, count });
  });

  app.post("/api/signatories", async (req, res) => {
    const parsed = insertSignatorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors });
    }
    const signatory = await storage.createSignatory(parsed.data);
    res.status(201).json(signatory);
  });

  app.post("/api/certification-inquiry", async (req, res) => {
    const parsed = insertCertificationInquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors });
    }

    const inquiry = await storage.createCertificationInquiry(parsed.data);

    try {
      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: fromEmail || "onboarding@resend.dev",
        to: "stephencwebster@gmail.com",
        subject: `Certification Inquiry: ${parsed.data.certificationLevel} — ${parsed.data.name}`,
        html: `
          <h2>New Asimov Agent Certification Inquiry</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Name</td><td style="padding:6px 12px;">${parsed.data.name}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Email</td><td style="padding:6px 12px;"><a href="mailto:${parsed.data.email}">${parsed.data.email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Organization</td><td style="padding:6px 12px;">${parsed.data.organization || '—'}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">GitHub Repo</td><td style="padding:6px 12px;"><a href="${parsed.data.githubRepo}">${parsed.data.githubRepo}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Level</td><td style="padding:6px 12px;">${parsed.data.certificationLevel}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Message</td><td style="padding:6px 12px;">${parsed.data.message || '—'}</td></tr>
          </table>
          <p style="margin-top:16px;color:#888;font-size:12px;">Submitted ${new Date().toISOString()}</p>
        `
      });
    } catch (emailErr) {
      console.error("Failed to send certification inquiry email:", emailErr);
    }

    res.status(201).json({ success: true, id: inquiry.id });
  });

  // ==================== ADMIN INVOICE ROUTES ====================

  app.get("/api/admin/invoices", adminAuth, async (req, res) => {
    const allInvoices = await storage.listInvoices();
    res.json(allInvoices);
  });

  app.get("/api/admin/invoices/:id", adminAuth, async (req, res) => {
    const invoice = await storage.getInvoice(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  });

  app.post("/api/admin/invoices", adminAuth, async (req, res) => {
    const parsed = createInvoiceBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors });
    }

    const { lineItems, taxRate, dueDate, ...rest } = parsed.data;

    const subtotal = lineItems.reduce((sum, item) => sum + Math.round(item.quantity * item.unitPrice), 0);
    const taxAmount = Math.round(subtotal * (taxRate / 10000));
    const total = subtotal + taxAmount;
    const invoiceNumber = await storage.getNextInvoiceNumber();

    const invoice = await storage.createInvoice({
      ...rest,
      invoiceNumber,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: "draft",
      dueDate: new Date(dueDate),
    });

    res.status(201).json(invoice);
  });

  app.post("/api/admin/invoices/:id/send", adminAuth, async (req, res) => {
    const invoice = await storage.getInvoice(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const siteUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'futurespeak.ai'}`;
    const payUrl = `${siteUrl}/pay/${invoice.id}`;

    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } = await import("docx");

      const lineItemRows = (invoice.lineItems as any[]).map((item: any) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.description, size: 20 })] })], width: { size: 50, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: String(item.quantity), size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `$${(item.unitPrice / 100).toFixed(2)}`, size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `$${(item.quantity * item.unitPrice / 100).toFixed(2)}`, size: 20 })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
          ]
        })
      );

      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20 })] })], width: { size: 50, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Qty", bold: true, size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Unit Price", bold: true, size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Amount", bold: true, size: 20 })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
        ]
      });

      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({ children: [new TextRun({ text: "FutureSpeak.AI", bold: true, size: 32, color: "060B19" })], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "Enterprise AI Strategy & Consulting", size: 20, color: "666666" })], spacing: { after: 400 } }),
            new Paragraph({ children: [new TextRun({ text: `INVOICE ${invoice.invoiceNumber}`, bold: true, size: 28 })], spacing: { after: 200 } }),
            new Paragraph({ children: [new TextRun({ text: `Date: ${new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 20 })], spacing: { after: 50 } }),
            new Paragraph({ children: [new TextRun({ text: `Due: ${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 20 })], spacing: { after: 300 } }),
            new Paragraph({ children: [new TextRun({ text: "Bill To:", bold: true, size: 22 })], spacing: { after: 50 } }),
            new Paragraph({ children: [new TextRun({ text: invoice.clientName, size: 20 })], spacing: { after: 50 } }),
            ...(invoice.clientOrganization ? [new Paragraph({ children: [new TextRun({ text: invoice.clientOrganization, size: 20 })], spacing: { after: 50 } })] : []),
            new Paragraph({ children: [new TextRun({ text: invoice.clientEmail, size: 20 })], spacing: { after: 300 } }),
            new Table({ rows: [headerRow, ...lineItemRows], width: { size: 100, type: WidthType.PERCENTAGE } }),
            new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Subtotal: $${(invoice.subtotal / 100).toFixed(2)}`, size: 20 })] }),
            ...(invoice.taxAmount > 0 ? [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Tax (${(invoice.taxRate / 100).toFixed(2)}%): $${(invoice.taxAmount / 100).toFixed(2)}`, size: 20 })] })] : []),
            new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 300 }, children: [new TextRun({ text: `Total Due: $${(invoice.total / 100).toFixed(2)}`, bold: true, size: 24 })] }),
            ...(invoice.notes ? [new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Notes:", bold: true, size: 20 })]}), new Paragraph({ children: [new TextRun({ text: invoice.notes, size: 20 })], spacing: { after: 300 }})] : []),
            new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "Pay online: ", size: 20 }), new TextRun({ text: payUrl, size: 20, color: "0066CC" })] }),
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const base64Doc = buffer.toString('base64');

      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: fromEmail || "onboarding@resend.dev",
        to: invoice.clientEmail,
        subject: `Invoice ${invoice.invoiceNumber} from FutureSpeak.AI`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#060B19;">Invoice ${invoice.invoiceNumber}</h2>
            <p>Hi ${invoice.clientName},</p>
            <p>Please find your invoice attached. The total amount due is <strong>$${(invoice.total / 100).toFixed(2)}</strong>, payable by ${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            <p style="margin:24px 0;">
              <a href="${payUrl}" style="background:#060B19;color:#00F0FF;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">Pay Now &rarr;</a>
            </p>
            <p style="color:#888;font-size:12px;">FutureSpeak.AI &middot; Enterprise AI Strategy & Consulting</p>
          </div>
        `,
        attachments: [{
          filename: `${invoice.invoiceNumber}.docx`,
          content: base64Doc,
        }],
      });

      await storage.updateInvoiceStatus(invoice.id, "sent");
      const updated = await storage.getInvoice(invoice.id);
      res.json(updated);
    } catch (err: any) {
      console.error("Failed to send invoice:", err);
      res.status(500).json({ message: "Failed to send invoice: " + err.message });
    }
  });

  // ==================== PUBLIC PAYMENT ROUTES ====================

  app.get("/api/invoices/:id/pay", async (req, res) => {
    const invoice = await storage.getInvoice(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientOrganization: invoice.clientOrganization,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate,
      createdAt: invoice.createdAt,
      notes: invoice.notes,
    });
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (err) {
      res.status(500).json({ message: "Stripe not configured" });
    }
  });

  app.post("/api/invoices/:id/create-payment-intent", async (req, res) => {
    const invoice = await storage.getInvoice(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (invoice.status === "paid") return res.status(400).json({ message: "Invoice already paid" });

    try {
      const stripe = await getUncachableStripeClient();

      if (invoice.stripePaymentIntentId) {
        const existing = await stripe.paymentIntents.retrieve(invoice.stripePaymentIntentId);
        if (existing.status !== 'canceled' && existing.status !== 'succeeded') {
          return res.json({ clientSecret: existing.client_secret });
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: invoice.total,
        currency: 'usd',
        metadata: {
          invoiceId: String(invoice.id),
          invoiceNumber: invoice.invoiceNumber,
        },
      });

      await storage.updateInvoiceStripePaymentIntent(invoice.id, paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      console.error("Failed to create payment intent:", err);
      res.status(500).json({ message: "Payment setup failed" });
    }
  });

  app.post("/api/invoices/:id/confirm-payment", async (req, res) => {
    const invoice = await storage.getInvoice(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (invoice.status === "paid") return res.json({ success: true, status: "paid" });

    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ message: "Missing paymentIntentId" });

    if (invoice.stripePaymentIntentId && invoice.stripePaymentIntentId !== paymentIntentId) {
      return res.status(403).json({ message: "Payment intent does not match invoice" });
    }

    try {
      const stripe = await getUncachableStripeClient();
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (pi.metadata?.invoiceId !== String(invoice.id)) {
        return res.status(403).json({ message: "Payment intent does not belong to this invoice" });
      }

      if (pi.amount !== invoice.total) {
        return res.status(403).json({ message: "Payment amount mismatch" });
      }

      if (pi.status === 'succeeded') {
        await storage.updateInvoicePaidAt(invoice.id, new Date(), paymentIntentId);

        try {
          const { client, fromEmail } = await getUncachableResendClient();
          await client.emails.send({
            from: fromEmail || "onboarding@resend.dev",
            to: "stephencwebster@gmail.com",
            subject: `Payment Received: ${invoice.invoiceNumber} — $${(invoice.total / 100).toFixed(2)}`,
            html: `
              <h2>Payment Received</h2>
              <p><strong>${invoice.invoiceNumber}</strong> has been paid.</p>
              <table style="border-collapse:collapse;font-family:sans-serif;">
                <tr><td style="padding:4px 12px;font-weight:bold;">Client</td><td style="padding:4px 12px;">${invoice.clientName}</td></tr>
                <tr><td style="padding:4px 12px;font-weight:bold;">Amount</td><td style="padding:4px 12px;">$${(invoice.total / 100).toFixed(2)}</td></tr>
                <tr><td style="padding:4px 12px;font-weight:bold;">Stripe ID</td><td style="padding:4px 12px;">${paymentIntentId}</td></tr>
              </table>
            `
          });
        } catch (emailErr) {
          console.error("Failed to send payment notification email:", emailErr);
        }

        return res.json({ success: true, status: "paid" });
      }

      res.json({ success: false, status: pi.status });
    } catch (err: any) {
      console.error("Payment confirmation error:", err);
      res.status(500).json({ message: "Payment confirmation failed" });
    }
  });

  return httpServer;
}
