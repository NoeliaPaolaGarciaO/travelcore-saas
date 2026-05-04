const params = new URLSearchParams(window.location.search);
const token = params.get("token");

async function cargar(){

    const { data } = await supabase
        .from("files")
        .select("*")
        .eq("public_token", token)
        .single();

    if(!data){
        document.body.innerHTML = "Voucher no encontrado";
        return;
    }

    vCliente.innerText = data.cliente;
    vConcepto.innerText = data.concepto;

    vPasajeros.innerHTML = data.pasajeros.map(p => `
        <div class="card">${p.nombre} ${p.apellido}</div>
    `).join("");

}

cargar();