import { Printer, X } from 'lucide-react';

export function SaleReceipt({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white w-full max-auto max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal - Não sai na impressão */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 no-print">
          <h3 className="font-bold text-gray-700">Visualizar Recibo</h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Printer size={18} /> Imprimir
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Área do Recibo - O que será impresso */}
        <div className="p-10 overflow-y-auto bg-white print:p-0" id="printable-receipt">
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-black text-blue-600">SISTEMA ERP</h1>
              <p className="text-gray-500 text-sm">Comprovante de Venda Oficial</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">Recibo Nº: {sale.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-gray-500 text-sm">Data: {new Date(sale.created_at).toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dados do Cliente</h4>
            <p className="text-lg font-bold text-gray-800">{sale.clients?.name}</p>
            <p className="text-gray-600">{sale.clients?.email}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumo da Transação</h4>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <span className="text-gray-600 font-medium">Status do Pagamento:</span>
              <span className="text-green-600 font-bold uppercase">Confirmado / Pago</span>
            </div>
          </div>

          <div className="border-t-2 border-gray-100 pt-6 mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-400">Este documento é um recibo de venda simplificado.</p>
                <p className="text-sm text-gray-400">Obrigado pela preferência!</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-medium">Valor Total</p>
                <p className="text-4xl font-black text-gray-900 leading-none">
                  R$ {Number(sale.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}