let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

// =======================
// CHECK LOGIN
// =======================
if(!usuario){
    window.location.href = "login.html";
} else {

    // UX DEMO
    if(usuario.email === "demo@travelcore.com"){
        setTimeout(() => {
            alert("Estás viendo una demo 🚀");
        }, 500);
    }

    init();
}

let agencia = null;

// =======================
// INIT
// =======================
async function init(){

    await cargarAgencia();

    if(!agencia){
        console.error("No se pudo cargar la agencia");
        return;
    }

    await checkPlan();
    await cargarBranding();
}

// =======================
// CARGAR AGENCIA
// =======================
async function cargarAgencia(){

    const { data, error } = await supabase
        .from("agencias")
        .select("*")
        .eq("id", usuario.agencia_id)
        .single();

    if(error){
        console.error("Error agencia:", error);
        return;
    }

    agencia = data;
}

// =======================
// BRANDING
// =======================
async function cargarBranding(){

    if(!agencia) return;

    if(document.getElementById("nombreAgencia")){
        nombreAgencia.innerText = agencia.nombre;
    }

    if(agencia.logo && document.getElementById("logoAgencia")){
        logoAgencia.src = agencia.logo;
    }

    if(agencia.color_primary){
        document.documentElement.style
            .setProperty('--violeta-deep', agencia.color_primary);
    }
}

// =======================
// PLAN / BLOQUEO
// =======================
async function checkPlan(){

    if(!agencia) return;

    const hoy = new Date();
    const vencimiento = new Date(agencia.fecha_vencimiento);

    if(
        agencia.estado_suscripcion === "cancelada" ||
        (agencia.estado_suscripcion !== "activa" && hoy > vencimiento)
    ){
        document.body.innerHTML = `
            <div style="text-align:center;margin-top:100px">
                <h1>🚫 Cuenta bloqueada</h1>
                <button onclick="irAPagar()">Pagar</button>
            </div>
        `;
    }
}

// =======================
// STRIPE CHECKOUT
// =======================
async function irAPagar(){

    try{
        const res = await fetch(
            `${SUPABASE_URL}/functions/v1/create-checkout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    agencia_id: usuario.agencia_id
                })
            }
        );

        const data = await res.json();

        if(data.url){
            window.location.href = data.url;
        } else {
            alert("Error creando pago");
        }

    }catch(e){
        console.error(e);
        alert("Error de conexión");
    }
}

// =======================
// LOGOUT
// =======================
function logout(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}