const IVA_VALOR = 0.16;

document.getElementById('btn-cotizar').addEventListener('click', procesarSimulacion);
document.getElementById('btn-limpiar').addEventListener('click', limpiarFormulario);
document.getElementById('monto').addEventListener('input', actualizarTotalesFinanciamiento);
document.getElementById('comision-apertura').addEventListener('input', actualizarTotalesFinanciamiento);

function formatearMoneda(valor) {
    return valor.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function obtenerTotalFinanciar() {
    const monto = parseFloat(document.getElementById('monto').value) || 0;
    const comision = parseFloat(document.getElementById('comision-apertura').value) || 0;
    const ivaComision = comision * IVA_VALOR;
    return monto + comision + ivaComision;
}

function actualizarTotalesFinanciamiento() {
    const comision = parseFloat(document.getElementById('comision-apertura').value) || 0;
    const ivaComision = comision * IVA_VALOR;
    const totalFinanciar = obtenerTotalFinanciar();

    document.getElementById('iva-apertura').value = formatearMoneda(ivaComision);
    document.getElementById('total-financiar').value = formatearMoneda(totalFinanciar);
}

function procesarSimulacion() {
    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const montoInput = parseFloat(document.getElementById('monto').value);
    const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
    const plazoMeses = parseInt(document.getElementById('plazo').value, 10);
    const totalFinanciar = obtenerTotalFinanciar();

    if (!nombreCliente) {
        alert('Ingrese el nombre del cliente.');
        return;
    }

    if (isNaN(montoInput) || isNaN(tasaAnualInput) || montoInput <= 0 || totalFinanciar <= 0) {
        alert('Ingrese parámetros numéricos válidos e intente nuevamente.');
        return;
    }

    actualizarTotalesFinanciamiento();

    const amortizacionCapital = totalFinanciar / plazoMeses;
    const tasaMensualEquivalente = tasaAnualInput / 12;
    let saldoInsoluto = totalFinanciar;

    const tablaBody = document.querySelector('#tabla-amortizacion tbody');
    tablaBody.innerHTML = '';

    let acumuladoPagos = 0;
    let acumuladoIntereses = 0;
    let acumuladoIVA = 0;

    for (let periodo = 1; periodo <= plazoMeses; periodo++) {
        const saldoInicial = saldoInsoluto;
        const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
        const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
        const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;

        acumuladoPagos += pagoMensualTotal;
        acumuladoIntereses += interesDelPeriodo;
        acumuladoIVA += ivaSobreInteres;

        saldoInsoluto -= amortizacionCapital;
        if (saldoInsoluto < 0.01) {
            saldoInsoluto = 0;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${periodo}</td>
            <td>${formatearMoneda(saldoInicial)}</td>
            <td>${formatearMoneda(amortizacionCapital)}</td>
            <td>${formatearMoneda(interesDelPeriodo)}</td>
            <td>${formatearMoneda(ivaSobreInteres)}</td>
            <td>${formatearMoneda(pagoMensualTotal)}</td>
            <td>${formatearMoneda(saldoInsoluto)}</td>
        `;
        tablaBody.appendChild(fila);
    }

    const pagoPromedio = acumuladoPagos / plazoMeses;

    document.getElementById('pago-promedio').textContent = formatearMoneda(pagoPromedio);
    document.getElementById('total-intereses').textContent = formatearMoneda(acumuladoIntereses);
    document.getElementById('total-iva').textContent = formatearMoneda(acumuladoIVA);
    document.getElementById('total-pagar').textContent = formatearMoneda(acumuladoPagos);
    document.getElementById('resumen').classList.remove('hidden');
}

function limpiarFormulario() {
    document.getElementById('credit-form').reset();
    document.getElementById('monto').value = '150000';
    document.getElementById('comision-apertura').value = '0';
    document.getElementById('tasa').value = '34';
    document.getElementById('plazo').value = '48';

    actualizarTotalesFinanciamiento();

    document.querySelector('#tabla-amortizacion tbody').innerHTML = '';
    document.getElementById('resumen').classList.add('hidden');
    document.getElementById('pago-promedio').textContent = '$0.00';
    document.getElementById('total-intereses').textContent = '$0.00';
    document.getElementById('total-iva').textContent = '$0.00';
    document.getElementById('total-pagar').textContent = '$0.00';
}

document.getElementById('credit-form').addEventListener('submit', function (event) {
    event.preventDefault();
    procesarSimulacion();
});

actualizarTotalesFinanciamiento();
