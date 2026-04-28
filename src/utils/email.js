import { MailtrapClient } from "mailtrap";
import 'dotenv/config';

const client = new MailtrapClient({ 
    token: process.env.MAILTRAP_TOKEN,
    testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID) 
});

export const sendOTPEmail = async (userEmail, otpCode) => {
    const sender = {
        name: "SENA TaskApp Premium",
        email: "seguridad@taskappsena.edu.co"
    };

    // ESTO ES EL CUERPO DEL CORREO, NO UNA VISTA DEL FRONTEND
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; background-color: #111827; border: 1px solid #374151; border-radius: 12px; color: #f9fafb;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #8b5cf6; margin: 0; font-size: 24px;">Recuperación de Acceso</h2>
            </div>
            <p style="color: #d1d5db; font-size: 16px;">Hola,</p>
            <p style="color: #d1d5db; font-size: 16px;">Tu código de seguridad de un solo uso para restablecer tu contraseña es:</p>
            <div style="text-align: center; margin: 35px 0;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ffffff; background: #1f2937; padding: 15px 30px; border-radius: 8px; border: 1px solid #8b5cf6; display: inline-block;">${otpCode}</span>
            </div>
            <p style="color: #ef4444; font-size: 14px; text-align: center; font-weight: 600;">Este código expirará en 30 minutos.</p>
        </div>
    `;

    try {
        await client.testing.send({
            from: sender,
            to: [{ email: userEmail }],
            subject: "Código de Recuperación 🔐",
            html: htmlContent,
            category: "Recuperacion_OTP",
        });
    } catch (error) {
        console.error("Error Mailtrap:", error);
        throw new Error("No se pudo despachar el correo de seguridad.");
    }
};