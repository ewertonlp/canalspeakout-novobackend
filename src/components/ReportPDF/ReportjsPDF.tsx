import { RelatoController } from 'controllers/RelatoController';
import { RelatoHistoricoController } from 'controllers/RelatoHistoricoController';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

const ReportJsPDF = async id => {

    try {

        let r = await new RelatoController().BuscarPorId(Number(id));

        const doc = new jsPDF();

        let y = 195;

        doc.text('Relatório de Denúncia', 105, 20, { align: 'center' });
        doc.setFontSize(12);

        doc.text('Informações Gerais', 20, 40);
        doc.text(`ID: ${r.Id}`, 20, 50);
        doc.text(`Protocolo: ${r.Protocolo}`, 20, 55);
        doc.text(`Email: ${r.EmailDenunciante}`, 20, 60);
        doc.text(`Status: ${r.Status}`, 20, 65);
        doc.text(`Sensibilidade: ${r.Sensibilidade}`, 20, 70);
        doc.text(`Criado em: ${r.DataCad}`, 20, 75);
        doc.text(`Atualizado em: ${r.DataAlt}`, 20, 80);
        doc.text('Detalhes do Denunciante', 20, 90);
        doc.text(`Nome: ${r.NomeDenunciante}`, 20, 95);
        doc.text(`Cargo: ${r.CargoDenunciante}`, 20, 100);
        doc.text(`Email: ${r.EmailDenunciante}`, 20, 105);
        doc.text(`Empresa: ${r.Empresa}`, 20, 110);
        doc.text(`Relação: ${r.RelacaoDenuncianteEmpresa}`, 20, 115);
        doc.text(`Infração: ${r.Infracao}`, 20, 120);
        doc.text(`Telefone: ${r.TelefoneDenunciante}`, 20, 125);
        doc.text(`Evidência: ${r.Evidencia}`, 20, 130);
        doc.text(`Área de Atuação: ${r.AreaDenunciante}`, 20, 135);
        doc.text(`Identificação: ${r.Identificado ? 'Sim' : 'Não'}`, 20, 140);
        doc.text(`Tipo de denúncia: ${r.InfracaoEspecifica}`, 20, 145);
        doc.text(
            `Data da ocorrência: ${format(new Date(r.DataInfracao), 'dd/MM/yyyy')}`,
            20,
            150,
        );
        doc.text(`Horário para contato: ${r.HorarioContato}`, 20, 155);
        doc.text(`Autor da ocorrência: ${r.NomeInfrator}`, 20, 160);
        doc.text(`Local da ocorrência: ${r.LocalInfracao}`, 20, 165);
        doc.text(`Recorrência da ocorrência: ${r.Recorrencia}`, 20, 170);
        doc.text(`Testemunhas da ocorrência: ${r.Testemunhas}`, 20, 175);
        doc.text(`Grau de certeza da denuncia: ${r.GrauCerteza}`, 20, 180);
        doc.text('Conclusão', 20, 190);

        let hs = await new RelatoHistoricoController().ListarPorIdRelato(r.Id);

        hs.forEach((h) => {
            doc.text(`Criado em: ${format(new Date(h.DataCad), 'dd/MM/yyyy')}`, 20, y)
            y += 5
            doc.text(`Mensagem: ${h.Comentario}`, 20, y)
            y += 5
            doc.text(`Atualizado: ${format(new Date(h.DataAlt), 'dd/MM/yyyy')}`, 20, y)
            y += 10
        });

        // doc.save('relatorio.pdf');

        const pdfData = doc.output('blob');
        return pdfData;
    } 
    catch (error) {
        console.error('Erro ao gerar PDF:', error)
        return null
    }
}

export default ReportJsPDF
