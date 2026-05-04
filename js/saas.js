console.log("SAAS METRICS");

async function cargarMetricas(){

    // MRR
    const { data: subs } = await supabase
        .from("suscripciones")
        .select("*")
        .eq("estado","activa");

    const mrr = subs.reduce((a,b)=>a+b.monto,0);

    // churn
    const { data: canceladas } = await supabase
        .from("suscripciones")
        .select("*")
        .eq("estado","cancelada");

    // agencias
    const { data: agencias } = await supabase
        .from("agencias")
        .select("*");

    mrrBox.innerText = "$" + mrr;
    churnBox.innerText = canceladas.length;
    agenciasBox.innerText = agencias.length;
}

cargarMetricas();

async function cargarMetricas(){

    const { data } = await supabase
        .from("agencias")
        .select("*");

    let mrr = 0;
    let activos = 0;
    let churn = 0;

    data.forEach(a => {

        if(a.plan === "pro"){
            mrr += 20; // USD ejemplo
        }

        if(a.estado_suscripcion === "activa"){
            activos++;
        }

        if(a.estado_suscripcion === "cancelada"){
            churn++;
        }
    });

    mrrTotal.innerText = "$" + mrr;
    agenciasActivas.innerText = activos;
    churnRate.innerText = churn;
}

cargarMetricas();