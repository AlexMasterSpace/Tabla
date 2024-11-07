const calcularInteresPeriodo = (saldoInsoluto, frecuencia) => {
    const tasaMensual = 0.30;
    let diasMes, diasPeriodo;
    switch (frecuencia) {
        case 'semanal':
            diasPeriodo = 7.5;
            diasMes = 30.4;
            break;
        case 'quincenal':
            diasPeriodo = 15;
            diasMes = 30;
            break;
        case 'catorcenal':
            diasPeriodo = 14;
            diasMes = 30;
            break;
        default:
            diasPeriodo = 7;
    }
    return saldoInsoluto * (tasaMensual / diasMes) * diasPeriodo;
};

const formatearMoneda = (valor) => {
    return `$ ${Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const generarBotonesPlazo = () => {
    const plazoButtonsContainer = document.getElementById('plazoButtonsContainer');
    for (let i = 1; i <= 8; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('plazo-button');
        button.addEventListener('click', () => seleccionarPlazo(i));
        plazoButtonsContainer.appendChild(button);
    }
};

const seleccionarPlazo = (plazoSeleccionado) => {
    const frecuencia = document.getElementById('frecuencia').value;
    const maxPlazo = (frecuencia === 'semanal') ? 8 : 4;

    if (plazoSeleccionado <= maxPlazo) {
        document.querySelectorAll('.plazo-button').forEach((button) => {
            button.classList.remove('active');
        });
        document.querySelector(`.plazo-button:nth-child(${plazoSeleccionado})`).classList.add('active');
        validarFormulario();
    }
};

const ajustarPlazoMaximo = () => {
    const frecuencia = document.getElementById('frecuencia').value;
    const plazoButtonsContainer = document.getElementById('plazoButtonsContainer');
    
    // Primero, mostrar todos los botones
    document.querySelectorAll('.plazo-button').forEach(button => {
        button.style.display = 'inline-block'; // Aseguramos que todos los botones sean visibles inicialmente
        button.disabled = false; // Desactivamos el estado deshabilitado de todos los botones
    });

    if (frecuencia === 'semanal') {
        // Si es semanal, mostramos hasta 8 botones
        for (let i = 0; i < 8; i++) {
            document.querySelectorAll('.plazo-button')[i].style.display = 'inline-block';
        }
    } else if (frecuencia === 'quincenal' || frecuencia === 'catorcenal') {
        // Si es quincenal o catorcenal, mostramos solo los primeros 4 botones
        for (let i = 4; i < 8; i++) {
            document.querySelectorAll('.plazo-button')[i].style.display = 'none'; // Ocultamos los botones de 5 a 8
        }
    }

    // Llamar a la validación del formulario después de ajustar la visibilidad de los botones
    validarFormulario();
};

const validarFormulario = () => {
    const monto = Number(document.getElementById('montoSlider').value);
    const frecuencia = document.getElementById('frecuencia').value;
    const plazo = document.querySelector('.plazo-button.active') ? Number(document.querySelector('.plazo-button.active').textContent) : 0;
    const maxPlazo = (frecuencia === 'semanal') ? 8 : 4;

    const botonGenerar = document.getElementById('generarTabla');
    botonGenerar.disabled = monto < 500 || monto > 5000 || plazo < 1 || plazo > maxPlazo;
};

const calcularTablaAmortizacion = () => {
    const monto = Number(document.getElementById('montoSlider').value);
    const frecuencia = document.getElementById('frecuencia').value;
    const plazo = document.querySelector('.plazo-button.active') ? Number(document.querySelector('.plazo-button.active').textContent) : 0;

    const capital = monto / plazo;
    let saldoInsoluto = monto;
    let totalInteres = 0;
    let totalIVA = 0;
    let totalCuota = 0;

    let tabla = '';

    for (let i = 1; i <= plazo; i++) {
        const interes = calcularInteresPeriodo(saldoInsoluto, frecuencia);
        const iva = interes * 0.16;
        const cuota = capital + interes + iva;

        totalInteres += interes;
        totalIVA += iva;
        totalCuota += cuota;

        tabla += `
            <tr>
                <td class="periodo-column">${i}</td>
                <td>${formatearMoneda(capital)}</td>
                <td>${formatearMoneda(saldoInsoluto)}</td>
                <td>${formatearMoneda(interes)}</td>
                <td>${formatearMoneda(iva)}</td>
                <td>${formatearMoneda(cuota)}</td>
            </tr>
        `;

        saldoInsoluto -= capital;
    }

    tabla += `
        <tr class="total-row">
            <td class="periodo-column">Total</td>
            <td>${formatearMoneda(monto)}</td>
            <td></td>
            <td>${formatearMoneda(totalInteres)}</td>
            <td>${formatearMoneda(totalIVA)}</td>
            <td>${formatearMoneda(totalCuota)}</td>
        </tr>
    `;

    document.getElementById('tablaBody').innerHTML = tabla;
};

document.getElementById('montoSlider').addEventListener('input', (event) => {
    document.getElementById('montoDisplay').textContent = formatearMoneda(event.target.value);
    validarFormulario();
});

document.getElementById('frecuencia').addEventListener('change', ajustarPlazoMaximo);
document.getElementById('montoSlider').addEventListener('input', (event) => {
    document.getElementById('montoDisplay').textContent = formatearMoneda(event.target.value);
    validarFormulario();
});

const incrementarMonto = () => {
    const slider = document.getElementById('montoSlider');
    if (Number(slider.value) < 5000) {
        slider.value = Number(slider.value) + 500;
        document.getElementById('montoDisplay').textContent = formatearMoneda(slider.value);
        validarFormulario();
    }
};

const decrementarMonto = () => {
    const slider = document.getElementById('montoSlider');
    if (Number(slider.value) > 500) {
        slider.value = Number(slider.value) - 500;
        document.getElementById('montoDisplay').textContent = formatearMoneda(slider.value);
        validarFormulario();
    }
};

generarBotonesPlazo();
