// Importar jsPDF
const { jsPDF } = window.jspdf;

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inspeccion-form');
    
    // Añadir clase de color según la selección
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function() {
            // Remover clases anteriores
            this.classList.remove('bueno', 'regular', 'malo');
            // Añadir clase según el valor seleccionado
            if (this.value) {
                this.classList.add(this.value);
            }
        });
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generarPDF();
    });
});

function generarPDF() {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Configurar estilos
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243); // Color primario
    
    // Título
    doc.text('Reporte de Inspección Preoperacional', 105, yPos, { align: 'center' });
    
    // Información básica
    doc.setFontSize(12);
    doc.setTextColor(0);
    yPos += 20;
    
    // Información general
    doc.text(`Fecha: ${document.getElementById('fecha').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Placa: ${document.getElementById('placa').value}`, 20, yPos);
    yPos += 10;
    doc.text(`Conductor: ${document.getElementById('conductor').value}`, 20, yPos);
    yPos += 15;

    // Recopilar todos los items de verificación
    const items = document.querySelectorAll('.item-check');
    
    doc.setFontSize(14);
    doc.setTextColor(33, 150, 243);
    doc.text('Resultados de la Inspección:', 20, yPos);
    doc.setFontSize(12);
    doc.setTextColor(0);
    yPos += 10;

    items.forEach(item => {
        const label = item.querySelector('label').textContent;
        const select = item.querySelector('select');
        const obs = item.querySelector('input[type="text"]').value;
        
        // Verificar si hay espacio suficiente en la página
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.text(`${label} ${select.value}`, 20, yPos);
        if (obs) {
            yPos += 7;
            doc.setFontSize(10);
            doc.text(`Observación: ${obs}`, 30, yPos);
            doc.setFontSize(12);
        }
        yPos += 10;
    });

    // Observaciones generales
    const observaciones = document.getElementById('observaciones').value;
    if (observaciones) {
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(33, 150, 243);
        doc.text('Observaciones Generales:', 20, yPos);
        doc.setFontSize(12);
        doc.setTextColor(0);
        yPos += 10;
        doc.text(observaciones, 20, yPos);
    }

    // Guardar el PDF
    const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`inspeccion-vehicular-${fecha}.pdf`);
}