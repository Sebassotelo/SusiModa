import ProductoNuevo from "@/componentes/ProductoNuevo";
import React, { useContext, useEffect, useState } from "react";
import style from "../../styles/PanelDeControlIndex.module.scss";
import ContextGeneral from "@/servicios/contextPrincipal";
import ProductoPanel from "@/componentes/ProductoPanel";
import SeccionNueva from "@/componentes/SeccionNueva";
import Head from "next/head";

import { onAuthStateChanged } from "firebase/auth";
import Descuentos from "@/componentes/Descuentos";
import BuscadorPanel from "@/componentes/BuscadorPanel";

import { push } from "next/router";
import Loader from "@/componentes/Loader";

function Index() {
  const context = useContext(ContextGeneral);
  const { llamadaDB, inspectorSesion, verificarLogin } =
    useContext(ContextGeneral);

  const [showSeccion, setShowSeccion] = useState(1);
  // 1 = Seccion Productos
  // 2 = Seccion Descuentos
  // 3 = Seccion Stock
  // 4 = Seccion Usuario

  const [showNuevoProducto, setShowNuevoProducto] = useState(false);

  const mostrarVentana = () => {
    setShowNuevoProducto(!showNuevoProducto);
    if (showNuevoProducto === true) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    verificarLogin();
    llamadaDB();

    if (context.estadoUsuario == 0) {
      push("/");
    }
  }, []);
  return (
    <>
      <Head>
        <title>Susi Modista | Panel de Control</title>
      </Head>
      <div className={style.container}>
        {context.loader ? (
          <>
            {/* menu pc */}
            <div className={style.menu}>
              <li onClick={() => setShowSeccion(1)}>Productos</li>
              <li onClick={() => setShowSeccion(2)}>Descuentos</li>
            </div>

            {/* menu Movil */}
            <div className={style.menu__movil}>
              <li onClick={() => setShowSeccion(1)}>Productos</li>
              <li onClick={() => setShowSeccion(2)}>Descuentos</li>
            </div>
            <div className={style.secciones}>
              {showSeccion == 1 && (
                <>
                  <SeccionNueva />

                  <div className={style.listaProducto}>
                    {showNuevoProducto ? (
                      <>
                        <p
                          className={style.producto__nuevo__btn}
                          onClick={mostrarVentana}
                        >
                          Nuevo Producto
                        </p>
                        <ProductoNuevo setShowNuevoProducto={mostrarVentana} />
                      </>
                    ) : (
                      <>
                        <p
                          className={style.producto__nuevo__btn}
                          onClick={mostrarVentana}
                        >
                          Nuevo Producto
                        </p>
                      </>
                    )}
                    <BuscadorPanel />
                    {context.productos &&
                      context.productos.map((item) => {
                        return (
                          <>
                            {" "}
                            <ProductoPanel
                              title={item.title}
                              precio={item.precio}
                              desc={item.desc}
                              img={item.img}
                              stock={item.stock}
                              caracteristicas={item.caracteristicas}
                              id={item.id}
                              seccion={item.seccion}
                              descuento={item.descuento}
                              precioDescuento={item.precioDescuento}
                              destacado={item.destacado}
                            />
                          </>
                        );
                      })}
                  </div>
                </>
              )}
              {showSeccion == 2 && <Descuentos />}
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

export default Index;
