import React, { useContext, useEffect, useState } from "react";
import style from "../../styles/ProductosIndex.module.scss";
import ContextGeneral from "@/servicios/contextPrincipal";
import ItemMenuProductos from "@/componentes/ItemMenuProductos";
import ProductosTienda from "@/componentes/productos/ProductosTienda";
import Head from "next/head";
import { BiMenu } from "react-icons/bi";
import Loader from "@/componentes/Loader";
import { motion } from "framer-motion";

function Index() {
  const context = useContext(ContextGeneral);
  const {
    llamadaDB,
    setProductosPublicos,
    verificarLogin,
    setBusqueda,
    setLoader,
  } = useContext(ContextGeneral);

  const [showCategoria, setShowCategoria] = useState(false);

  const filtrarSeccion = (id) => {
    const nuevoArray = context.productosPublicosCopia.filter(
      (item) => item.seccion == id
    );
    setProductosPublicos(nuevoArray);
  };
  const filtrarSeccionOfertas = () => {
    const nuevoArray = context.productosPublicosCopia.filter(
      (item) => item.descuento
    );
    setProductosPublicos(nuevoArray);
  };

  const mostrarMenu = () => {
    setShowCategoria(!showCategoria);
  };

  useEffect(() => {
    if (context.productosPublicos.length == 0) {
      llamadaDB();
    }
    console.log(context.loader);
    verificarLogin();
  }, []);

  return (
    <>
      {context.loader ? (
        <>
          <Head>
            <title>Susi Modista | Productos</title>
          </Head>

          <div className={style.container}>
            <div className={style.container__productos}>
              {/* menu PC */}
              <ul className={style.menu}>
                <h3>Categorias</h3>
                <li
                  onClick={() => {
                    setProductosPublicos(context.productosPublicosCopia);
                    setBusqueda("");
                  }}
                >
                  Todo {`(${context.productosPublicosCopia.length})`}
                </li>
                <li
                  onClick={() => {
                    filtrarSeccionOfertas();
                    setBusqueda("");
                  }}
                >
                  Ofertas {`(${context.contadorOfert})`}{" "}
                </li>

                {context.secciones &&
                  context.secciones.map((item, i) => {
                    return (
                      <ItemMenuProductos
                        key={i}
                        funcion={filtrarSeccion}
                        item={item}
                      />
                    );
                  })}
              </ul>

              {/* menu mobile */}
              <ul className={style.menu__movil}>
                <div className={style.movil__cat} onClick={mostrarMenu}>
                  <BiMenu className={style.cat__icon} /> <h3>Categorias</h3>
                </div>

                {showCategoria && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={style.buscador}
                  >
                    <li
                      onClick={() => {
                        setProductosPublicos(context.productosPublicosCopia);
                        setBusqueda("");
                        mostrarMenu();
                      }}
                    >
                      Todo {`(${context.productosPublicosCopia.length})`}
                    </li>
                    <li
                      onClick={() => {
                        filtrarSeccionOfertas();
                        setBusqueda("");
                        mostrarMenu();
                      }}
                    >
                      Ofertas {`(${context.contadorOfert})`}{" "}
                    </li>
                    {context.secciones &&
                      context.secciones.map((item, i) => {
                        return (
                          <ItemMenuProductos
                            key={i}
                            funcion={filtrarSeccion}
                            item={item}
                            click={mostrarMenu}
                          />
                        );
                      })}
                  </motion.div>
                )}
              </ul>
              <div className={style.tienda}>
                {context.productosPublicos.length != 0 ? (
                  <ProductosTienda />
                ) : (
                  <p className={style.tienda__p}>
                    No se encontraron productos 😓
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Index;
