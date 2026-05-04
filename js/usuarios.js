console.log("USUARIOS");

let usuario = null;

// =======================
// INIT
// =======================
async function initUsuarios(){

    await checkAuth();

    await renderUsuarios();
}

// =======================
// AUTH
// =======================
async function checkAuth(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){
        window.location.href = "login.html";
        return;
    }

    const { data: usuarioDB, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", data.user.id)
        .single();

    if(error || !usuarioDB){
        alert("Usuario no registrado en la base");
        window.location.href = "login.html";
        return;
    }

    usuario = usuarioDB;
}

// =======================
// CREAR USUARIO
// =======================
async function crearUsuario(){

    if(usuario.rol !== "admin"){
        alert("Solo admin puede crear usuarios");
        return;
    }

    const email = emailNuevo.value;
    const password = prompt("Password mínimo 6 caracteres");

    if(!email || !password){
        alert("Completar datos");
        return;
    }

    if(password.length < 6){
        alert("Password mínimo 6 caracteres");
        return;
    }

    // 🔐 CREAR EN AUTH
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if(authError){
        alert(authError.message);
        return;
    }

    // 💾 CREAR EN TABLA usuarios
    const { error } = await supabase.from("usuarios").insert([{
        email,
        rol: rolNuevo.value,
        agencia_id: usuario.agencia_id,
        auth_id: authData.user.id
    }]);

    if(error){
        alert("Error creando usuario");
        return;
    }

    alert("Usuario creado 🚀");

    renderUsuarios();
}

// =======================
// LISTAR USUARIOS
// =======================
async function renderUsuarios(){

    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("agencia_id", usuario.agencia_id);

    if(error || !data){
        console.error("Error cargando usuarios");
        return;
    }

    listaUsuarios.innerHTML = data.map(u => `
        <div class="card">
            <b>${u.email}</b>
            <br>${u.rol}
        </div>
    `).join("");
}

// =======================
initUsuarios();