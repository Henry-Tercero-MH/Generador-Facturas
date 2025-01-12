import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Printer, Save } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Invoice } from "../types/invoice";
import { jsPDF } from "jspdf";

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
    amountInWords: "",
    concept: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    receivedBy: "",
  });
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState(""); // Estado para el nombre
  const [apellido, setApellido] = useState(""); // Estado para el apellido

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

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
      // Aquí deberías guardar la factura en tu base de datos si tuvieras una
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

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Factura No: ${invoice.number}`, 10, 10);
    doc.text(`Cantidad: Q${invoice.amount}`, 10, 20);
    doc.text(`Recibí de: ${nombre} ${apellido}`, 10, 30);
    doc.text(`Cantidad en Letras: ${invoice.amountInWords}`, 10, 40);
    doc.text(`Por Concepto de: ${invoice.concept}`, 10, 50);
    doc.text(`Lugar: ${invoice.location}`, 10, 60);
    doc.text(
      `Fecha: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`,
      10,
      70
    );
    doc.text(`Recibí Conforme: ${invoice.receivedBy}`, 10, 80);
    return doc;
  };

  const enviarWhatsApp = (numero: string, urlPDF: string) => {
    const mensaje = `Hola, aquí está tu archivo: ${urlPDF}`;
    const enlaceWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(enlaceWhatsApp, "_blank");
  };

  const handleEnviar = () => {
    const doc = generarPDF();
    const pdfBlob = doc.output("blob");
    const urlPDF = URL.createObjectURL(pdfBlob);
    enviarWhatsApp(numero, urlPDF);
  };

  const handleGuardarPDF = () => {
    const fecha = new Date(invoice.date);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    const fileName = `Recibo_${nombre}_${apellido}_${dia}_${mes}_${año}.pdf`;
    const doc = generarPDF();
    doc.save(fileName);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1648876672455-56cc2aa32b65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhaXNhamUlMjBwY3xlbnwwfHwwfHx8MA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1
                className="text-2xl font-bold text-white"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1648876672455-56cc2aa32b65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhaXNhamUlMjBwY3xlbnwwfHwwfHx8MA%3D%3D')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
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

      <main
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGV4dHVyYXxlbnwwfHwwfHx8MA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1527049979667-990f1d0d8e7f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRleHR1cmF8ZW58MHx8MHx8fDA%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
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

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Apellido
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
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
          </form>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={handleGuardarPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar PDF
            </button>
          </div>

          <div className="mt-6">
            <label
              htmlFor="numero"
              className="block text-sm font-medium text-gray-300"
            >
              Número de Teléfono:
            </label>
            <input
              type="text"
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
            />
            <button
              onClick={handleEnviar}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
            >
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceGenerator;
