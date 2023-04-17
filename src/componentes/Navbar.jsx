import React, { useContext, useEffect, useState } from "react";
import style from "../styles/Navbar.module.scss";
import Link from "next/link";
import ContextGeneral from "@/servicios/contextPrincipal";
import { signOut } from "firebase/auth";
import {
  AiOutlineShoppingCart,
  AiOutlineHome,
  AiOutlineSearch,
} from "react-icons/ai";
import { RiStore2Line } from "react-icons/ri";
import { motion } from "framer-motion";

import BuscadorTienda from "./BuscadorTienda";

function Navbar({ showCarrito, show }) {
  const context = useContext(ContextGeneral);
  const [contadorProductos, setContadorProductos] = useState(0);
  const [showBuscador, setShowBuscador] = useState(false);

  const cantidadProductos = () => {
    let acumulador = 0;
    for (let i = 0; i < context.carrito.length; i++) {
      acumulador = acumulador + context.carrito[i].cantidad;
    }
    setContadorProductos(acumulador);
  };

  const mostrarBuscador = () => {
    setShowBuscador(!showBuscador);
  };

  useEffect(() => {
    cantidadProductos();
  }, [context.actuCarrito]);

  return (
    <div className={style.container}>
      <ul className={style.navbar}>
        <Link href="/">
          {" "}
          <AiOutlineHome className={style.icon} />{" "}
        </Link>
        <Link href="/productos">
          <RiStore2Line className={style.icon} />{" "}
        </Link>

        <AiOutlineSearch className={style.icon} onClick={mostrarBuscador} />

        <p className={style.icon} onClick={showCarrito}>
          <AiOutlineShoppingCart style={{ color: show && "#f2ced1" }} />{" "}
          {contadorProductos > 0 && (
            <p style={{ color: show && "#f2ced1" }}>({contadorProductos})</p>
          )}
        </p>
        {context.estadoUsuario == 1 && (
          <>
            {" "}
            <Link href="/panel-de-control">Panel de Control</Link>
            {context.user && (
              <p onClick={() => signOut(context.auth)}>Cerrar Sesion</p>
            )}
          </>
        )}
      </ul>
      {showBuscador && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={style.buscador}
        >
          <BuscadorTienda setShow={setShowBuscador} />
        </motion.div>
      )}
    </div>
  );
}

export default Navbar;
