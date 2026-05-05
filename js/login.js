console.log("LOGIN PRO FINAL");

// =======================
// LOGIN
// =======================
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

    if(!user){
        alert("Error de login");
        return;
    }

    // buscar usuario interno
    let { data: usuarioDB, error: errUser } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", user.id)
        .single();

    // AUTO CREAR SI NO EXISTE
    if(errUser || !usuarioDB){

        console.log("Creando usuario interno...");

        let { data: agencia } = await supabase
            .from("agencias")
            .select("*")
            .limit(1)
            .single();

        if(!agencia){
            const { data: nuevaAgencia } = await supabase
                .from("agencias")
                .insert([{
                    nombre: "Demo",
                    dominio: "demo"
                }])
                .select()
                .single();

            agencia = nuevaAgencia;
        }

        const { data: nuevoUsuario } = await supabase
            .from("usuarios")
            .insert([{
                email: user.email,
                rol: "admin",
                agencia_id: agencia.id,
                auth_id: user.id
            }])
            .select()
            .single();

        usuarioDB = nuevoUsuario;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioDB));

    window.location.href = "index.html";
}

// =======================
// REGISTRO
// =======================
async function registro(){

    const nombreAgencia = prompt("Nombre de tu agencia");
    if(!nombreAgencia) return;

    if(password.value.length < 6){
        alert("Password mínimo 6 caracteres");
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
        alert("Revisá tu email para confirmar la cuenta 📩");
        return;
    }

    const user = data.user;

    // crear agencia
    const { data: agencia } = await supabase
        .from("agencias")
        .insert([{
            nombre: nombreAgencia,
            dominio: nombreAgencia.toLowerCase().replace(/\s/g, "")
        }])
        .select()
        .single();

    // crear usuario interno
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

    alert("Cuenta creada 🚀");

    window.location.href = "index.html";
}