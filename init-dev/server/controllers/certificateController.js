const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/UserProgress');

// Função auxiliar para gerar código curto (ex: CRT-12345678)
const generateValidationCode = () => {
    return 'CRT-' + uuidv4().split('-')[0].toUpperCase();
};

exports.issueCertificate = async (req, res) => {
    try {
        const userId = req.user._id; // Vem do token de autenticação
        const { courseId } = req.params;

        // 1. Verificar se o curso existe
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Curso não encontrado' });

        const user = await User.findById(userId);

        // 2. Verificar progresso (Segurança: só gera se tiver 100%)
        const progress = await Progress.findOne({ user: userId, course: courseId });
        
        // Opcional: Descomente a linha abaixo para forçar 100% de conclusão em produção
        // if (!progress || progress.completionPercentage < 100) {
        //    return res.status(400).json({ message: 'Você precisa concluir 100% do curso para receber o certificado.' });
        // }

        // 3. Verificar se já existe certificado emitido (para não duplicar)
        let certificate = await Certificate.findOne({ user: userId, course: courseId });

        if (!certificate) {
            // Se não existe, cria um novo registro no banco
            certificate = await Certificate.create({
                user: userId,
                course: courseId,
                validationCode: generateValidationCode()
            });
        }

        // 4. GERAR O PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        // Configurar cabeçalho para o navegador entender que é um PDF para baixar/visualizar
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Certificado-${course.title}.pdf`);

        doc.pipe(res); // Envia o PDF direto para a resposta

        // --- DESENHANDO O CERTIFICADO ---
        
        // Fundo / Borda (Retângulo Simples)
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fdfbf7'); // Fundo creme
        doc.lineWidth(20);
        doc.strokeColor('#0f766e'); // Cor Teal do seu site
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        // Logos e Títulos
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(40).fillColor('#1e293b').text('CERTIFICADO DE CONCLUSÃO', { align: 'center' });
        
        doc.moveDown(1);
        doc.font('Helvetica').fontSize(20).fillColor('#475569').text('Certificamos que', { align: 'center' });

        // Nome do Aluno
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(35).fillColor('#0f766e').text(user.name.toUpperCase(), { align: 'center' });

        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(18).fillColor('#475569').text(`concluiu com êxito o curso de`, { align: 'center' });

        // Nome do Curso
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').fontSize(28).fillColor('#1e293b').text(course.title, { align: 'center' });

        // Detalhes (Data e Carga Horária)
        doc.moveDown(2);
        const dateStr = new Date(certificate.issueDate).toLocaleDateString('pt-BR');
        doc.fontSize(14).text(`Concluído em: ${dateStr}`, { align: 'center' });
        
        // Código de Validação (Rodapé)
        doc.moveDown(4);
        doc.fontSize(10).fillColor('#94a3b8').text(`Código de Validação: ${certificate.validationCode}`, { align: 'center' });
        doc.text('Verifique a autenticidade em init.dev/validate', { align: 'center' });

        doc.end(); // Finaliza o arquivo

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar certificado' });
    }
};

// Rota para listar meus certificados (para o Dashboard do Aluno)
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id }).populate('course', 'title');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar certificados' });
    }
};