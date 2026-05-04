async function cargarAgenciaPorDominio(){

    const host = window.location.hostname;

    let subdominio = host.split(".")[0];

    // local fallback
    if(host.includes("127.0.0.1") || host.includes("localhost")){
        subdominio = "demo";
    }

    const { data } = await supabase
        .from("agencias")
        .select("*")
        .ilike("nombre", subdominio)
        .single();

    if(!data) return;

    document.documentElement.style.setProperty('--primary', data.color_primary);
    document.documentElement.style.setProperty('--secondary', data.color_secondary);

    if(data.logo){
        const logo = document.getElementById("logoAgencia");
        if(logo) logo.src = data.logo;
    }
}

cargarAgenciaPorDominio();