document.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);

function formatearMoneda(valor) {
    return valor.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function procesarSimulacion() {
    const montoInput = parseFloat(document.getElementById('monto').value);
    const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
    const plazoMeses = parseInt(document.getElementById('plazo').value, 10);
    const IVA_VALOR = 0.16;

    if (isNaN(montoInput) || isNaN(tasaAnualInput) || montoInput <= 0) {
        alert('Ingrese parámetros numéricos válidos e intente nuevamente.');
        return;
    }

    const amortizacionCapital = montoInput / plazoMeses;
    const tasaMensualEquivalente = tasaAnualInput / 12;
    let saldoInsoluto = montoInput;

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

document.getElementById('credit-form').addEventListener('submit', function (event) {
    event.preventDefault();
    procesarSimulacion();
});
