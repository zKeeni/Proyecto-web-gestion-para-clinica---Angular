const pool = require('../../configuracion/db');

exports.getUsuarios = async (req, res) => {
    const query = 'SELECT * FROM listarUsuario()';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor al obtener los usuarios' });
    }
};

exports.getUsuarioId = async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM usuario WHERE codigo = $1";
    try {
      const result = await pool.query(query, [id]);
      if (result.rowCount > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "No existe ese médico" });
      }
    } catch (error) {
      res.status(500).json({ error: "No se pudo obtener el médico por ID" });
    }
  };
  

  exports.registrarUsuario = async (req, res) => {
    const { codigo_rol, nombre_usuario, contrasenia } = req.body;
    const query = 'SELECT registrarUsuario($1, $2, $3) AS codigo';
    const values = [codigo_rol, nombre_usuario, contrasenia];

    try {
        const result = await pool.query(query, values);
        const codigoUsuario = result.rows[0].codigo;  // Obtener el código retornado

        res.status(200).json({ 
            message: 'Usuario registrado correctamente', 
            codigo_usuario: codigoUsuario 
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'No se pudo registrar al usuario' });
    }
};


exports.actualizarUsuario = async (req, res) => {
    const { codigo_usuario, codigo_rol, nombre_usuario, contrasenia, estado_usuario } = req.body;
    const query = 'SELECT actualizarUsuario($1, $2, $3, $4, $5)';
    const values = [codigo_usuario, codigo_rol, nombre_usuario, contrasenia, estado_usuario];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    console.log("XDDD" + id);
    const query = 'SELECT eliminarUsuario($1)';
    const values = [id];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor al eliminar el usuario' });
    }
};