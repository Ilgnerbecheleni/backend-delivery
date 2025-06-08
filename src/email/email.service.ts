// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  private renderTemplate(templateName: string, variables: Record<string, string>) {
    // Procura primeiro em dist, depois em src
    let templatePath = join(__dirname, 'templates', templateName);
    if (!existsSync(templatePath)) {
      templatePath = join(process.cwd(), 'src', 'email', 'templates', templateName);
    }
    let html = readFileSync(templatePath, 'utf8');
    Object.keys(variables).forEach(key => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    });
    return html;
  }

  async sendMail(to: string, subject: string, template: string, variables: Record<string, string>) {
    const html = this.renderTemplate(template, variables);

    const mailOptions = {
      from: `"Users" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }
}
