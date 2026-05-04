console.log("LOGIN PRO FINAL");

async function login(){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if(error){
        alert(error.message);
        return;
    }

    const user = data.user;

    let { data: usuarioDB } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", user.id)
        .single();

    if(!usuarioDB){

        let { data: agencia } = await supabase
            .from("agencias")
            .select("*")
            .limit(1)
            .single();

        if(!agencia){
            const { data: nueva } = await supabase
                .from("agencias")
                .insert([{
                    nombre: "Demo",
                    dominio: "demo"
                }])
                .select()
                .single();

            agencia = nueva;
        }

        const { data: nuevo } = await supabase
            .from("usuarios")
            .insert([{
                email: user.email,
                rol: "admin",
                agencia_id: agencia.id,
                auth_id: user.id
            }])
            .select()
            .single();

        usuarioDB = nuevo;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioDB));
    window.location.href = "index.html";
}

async function registro(){

    const nombreAgencia = prompt("Nombre de tu agencia");
    if(!nombreAgencia) return;

    if(password.value.length < 6){
        alert("Mínimo 6 caracteres");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
    });

    if(error){
        alert(error.message);
        return;
    }

    if(!data.user){
        alert("Revisá tu email 📩");
        return;
    }

    const user = data.user;

    const { data: agencia } = await supabase
        .from("agencias")
        .insert([{
            nombre: nombreAgencia,
            dominio: nombreAgencia.toLowerCase().replace(/\s/g, "")
        }])
        .select()
        .single();

    const { data: usuarioDB } = await supabase
        .from("usuarios")
        .insert([{
            email: email.value,
            rol: "admin",
            agencia_id: agencia.id,
            auth_id: user.id
        }])
        .select()
        .single();

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioDB));
    window.location.href = "index.html";
}