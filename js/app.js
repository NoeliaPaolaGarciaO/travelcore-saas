let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

if(!usuario){
    window.location.href = "login.html";
}

async function init(){

    await checkPlan();
    await cargarBranding();
}

async function cargarBranding(){

    const { data } = await supabase
        .from("agencias")
        .select("*")
        .eq("id", usuario.agencia_id)
        .single();

    if(!data) return;

    nombreAgencia.innerText = data.nombre;

    if(data.logo){
        logoAgencia.src = data.logo;
    }

    document.documentElement.style.setProperty('--violeta-deep', data.color_primary);
}

async function checkPlan(){

    const { data } = await supabase
        .from("agencias")
        .select("*")
        .eq("id", usuario.agencia_id)
        .single();

    if(!data) return;

    const hoy = new Date();
    const vencimiento = new Date(data.fecha_vencimiento);

    if(
        data.estado_suscripcion === "cancelada" ||
        (data.estado_suscripcion !== "activa" && hoy > vencimiento)
    ){
        document.body.innerHTML = `
            <div style="text-align:center;margin-top:100px">
                <h1>🚫 Cuenta bloqueada</h1>
                <button onclick="irAPagar()">Pagar</button>
            </div>
        `;
    }
}

async function irAPagar(){

    const res = await fetch(
        `${SUPABASE_URL}/functions/v1/create-checkout`,
        {
            method: "POST",
            body: JSON.stringify({
                agencia_id: usuario.agencia_id
            })
        }
    );

    const data = await res.json();
    window.location.href = data.url;
}

function logout(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}

init();