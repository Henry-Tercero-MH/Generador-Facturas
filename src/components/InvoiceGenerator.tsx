import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Printer, Save } from "lucide-react";
import { format } from "date-fns";
import { Invoice } from "../types/invoice";
import { db } from "../services/database";

const convertToWords = (amount: number): string => {
  const units = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const teens = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const tens = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const hundreds = ["", "cien", "doscientos"];

  const numberToWords = (n: number): string => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " y " + units[n % 10] : "");
    if (n <= 200)
      return (
        hundreds[Math.floor(n / 100)] +
        (n % 100 ? " " + numberToWords(n % 100) : "")
      );
    return "número fuera de rango";
  };

  const quetzales = Math.floor(amount);
  const cents = Math.round((amount - quetzales) * 100);

  if (cents === 0) {
    return `${numberToWords(quetzales)} quetzales exactos`;
  } else {
    return `${numberToWords(quetzales)} quetzales con ${numberToWords(
      cents
    )} centavos`;
  }
};

const InvoiceGenerator = () => {
  const { logout } = useAuth();
  const [invoice, setInvoice] = useState<Invoice>({
    number: "",
    amount: "", // Cambiado a cadena vacía
    receivedFrom: "",
    amountInWords: "",
    concept: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    receivedBy: "",
  });

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setInvoice({
      ...invoice,
      amount: value, // Guardar el valor como cadena
      amountInWords: convertToWords(amount),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.saveInvoice(invoice);
      alert("Recibo guardado exitosamente");
      // Reset form or redirect as needed
    } catch (error) {
      alert("Error al guardar el recibo");
      console.error(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Generador de Recibos
              </h1>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                {" "}
                <label
                  htmlFor="factura"
                  className="text-[34px] text-center font-bold"
                >
                  Factura
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    No. de Recibo
                  </label>
                  <input
                    type="text"
                    value={invoice.number}
                    onChange={(e) =>
                      setInvoice({ ...invoice, number: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Cantidad (Q)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Recibí de
                  </label>
                  <input
                    type="text"
                    value={invoice.receivedFrom}
                    onChange={(e) =>
                      setInvoice({ ...invoice, receivedFrom: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Cantidad en Letras
                  </label>
                  <input
                    type="text"
                    value={invoice.amountInWords}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-gray-300 shadow-sm p-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Por Concepto de
                  </label>
                  <textarea
                    value={invoice.concept}
                    onChange={(e) =>
                      setInvoice({ ...invoice, concept: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Lugar
                  </label>
                  <input
                    type="text"
                    value={invoice.location}
                    onChange={(e) =>
                      setInvoice({ ...invoice, location: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Fecha en que se genera el recibo
                  </label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) =>
                      setInvoice({ ...invoice, date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Recibí Conforme
                  </label>
                  <input
                    type="text"
                    value={invoice.receivedBy}
                    onChange={(e) =>
                      setInvoice({ ...invoice, receivedBy: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </button>
              </div>
            </form>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InvoiceGenerator;
