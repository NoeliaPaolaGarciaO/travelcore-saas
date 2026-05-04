const params = new URLSearchParams(window.location.search);
const token = params.get("token");

async function cargar(){

    const { data, error } = await supabase
        .from("files")
        .select("*, agencias(*)")
        .eq("public_token", token)
        .single();

    if(error || !data){
        document.body.innerHTML = "<h1>Voucher no encontrado</h1>";
        return;
    }

    // branding
    agenciaNombre.innerText = data.agencias.nombre;

    if(data.agencias.logo){
        logoAgencia.src = data.agencias.logo;
    }

    concepto.innerText = data.concepto;

    // pasajeros
    pasajeros.innerHTML = (data.pasajeros || []).map(p => `
        <div>${p.nombre} ${p.apellido}</div>
    `).join("");

    // servicios
    servicios.innerHTML = (data.servicios || []).map(s => `
        <div>${s.tipo} - ${s.proveedor}</div>
    `).join("");

    // pagos
    pagos.innerHTML = (data.pagos || []).map(p => `
        <div style="color:${p.estado==='pendiente'?'red':'lightgreen'}">
            ${p.proveedor} - $${p.monto} (${p.estado})
        </div>
    `).join("");
}

cargar();