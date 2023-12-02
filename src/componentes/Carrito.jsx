import React, { useContext, useEffect, useState } from "react";
import style from "../styles/Carrito.module.scss";
import ContextGeneral from "@/servicios/contextPrincipal";
import {
  MdOutlineDeleteOutline,
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

import { Toaster, toast } from "sonner";
import Link from "next/link";

function Carrito({ showCarrito, show }) {
  const context = useContext(ContextGeneral);
  const { setCarrito, actualizacionCarrito } = useContext(ContextGeneral);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [cantidadFinal, setCantidadFinal] = useState(0);
  const [pedido, setPedido] = useState();
  const [cuponActivo, setCuponActivo] = useState({});

  const [showCupon, setShowCupon] = useState(false);

  const [estadoPedido, setEstadoPedido] = useState(0);
  // 0 = nada
  // 1 = Realizar Pedido
  // 2 = Confirmar Pedido
  // 3 = Pedido Copiado

  const eliminarProducto = (id) => {
    const nuevoArray = context.carrito.filter((item, key) => item.id != id);
    setCarrito(nuevoArray);
    actualizacionCarrito();
  };

  let pedidoCopy = "";
  const confirmarPedido = () => {
    let notFoundArray = context.carrito.filter(
      (obj) => !context.productosPublicos.some((o) => o.id === obj.id)
    );
    notFoundArray.length === 0 ? true : notFoundArray;

    if (cantidadFinal > 0) {
      if (notFoundArray.length === 0) {
        pedidoCopy = "";
        context.carrito.map(
          (e) =>
            (pedidoCopy =
              pedidoCopy +
              `${e.cantidad}X%20${e.title}%20-----%20$${
                e.precio * e.cantidad
              }%20%0A`)
        );
        let cuponDesc = "";
        let descuentoCantidad = "";

        if (cuponActivo && cuponActivo.activo) {
          cuponDesc = `%0ACupon%20${cuponActivo.cupon}%20activo.%20Descuento%20de%20${cuponActivo.monto}%20porciento.`;
        }

        // if (cantidadFinal >= 4) {
        //   descuentoCantidad = `%0ADescuento%20por%20Cantidad.%20Descuento%20de%20$${
        //     cantidadFinal * 60
        //   }%20.`;
        // }

        setPedido(
          `Hola!%20Este%20es%20mi%20pedido:%0A%0A${pedidoCopy}%0ATotal:%20$${precioFinal}${
            cuponActivo && cuponDesc
          }${cantidadFinal && descuentoCantidad}`
        );

        if (cantidadFinal > 0) {
          setEstadoPedido(2);
          toast.success(`Envianos el pedido por WhatsApp`);
        }
      } else {
        toast.error(
          `Sin stock en: '${notFoundArray.map((item) => {
            return item.title;
          })}'`
        );
      }
    }
  };

  const sumarCantidad = (id) => {
    const nuevoArray = context.carrito;

    if (nuevoArray.find((e) => e.id === id)) {
      if (nuevoArray.find((e) => e.id === id).cantidad >= 0) {
        if (
          nuevoArray.find((e) => e.id === id).cantidad <
          nuevoArray.find((e) => e.id === id).stock
        ) {
          nuevoArray.find((e) => e.id === id).cantidad += 1;
          setCarrito(nuevoArray);
          actualizacionCarrito();
        } else {
          toast.error(
            `No hay stock suficiente para agregar esa cantidad al carrito`
          );
        }
      }
    }
  };
  const restarCantidad = (id) => {
    const nuevoArray = context.carrito;

    if (nuevoArray.find((e) => e.id === id)) {
      if (nuevoArray.find((e) => e.id === id).cantidad > 1) {
        nuevoArray.find((e) => e.id === id).cantidad -= 1;
        setCarrito(nuevoArray);
        actualizacionCarrito();
      }
    }
  };

  const aplicarCupon = (e) => {
    e.preventDefault();

    const cup = e.target.inputCupon.value;

    let descuento = [];

    descuento = context.cupones.filter(
      (item) => item.cupon.toLowerCase() == cup.toLowerCase()
    );

    if (descuento[0] && descuento[0].activo) {
      setPrecioFinal(precioFinal - precioTotal * (cuponActivo.monto / 100));
      setCuponActivo(descuento[0]);
      actualizacionCarrito();
    } else {
      toast.error("El cupón ingresado ha expirado o es incorrecto");
      setCuponActivo(0);
      descuento = [];
    }

    e.target.inputCupon.value = "";
  };

  let precioTotal = 0;
  let cantidadTotal = 0;

  useEffect(() => {
    context.carrito.map((e, i) => {
      precioTotal = precioTotal + e.precio * e.cantidad;

      cantidadTotal = cantidadTotal + e.cantidad;
    });

    if (cuponActivo && cuponActivo.activo) {
      setPrecioFinal(precioTotal - precioTotal * (cuponActivo.monto / 100));
      console.log("asfasdasd", precioTotal * (cuponActivo.monto / 100));
    } else {
      setPrecioFinal(precioTotal);
    }

    // if (cantidadTotal >= 4) {
    //   precioTotal = precioTotal - cantidadTotal * 60;
    //   setPrecioFinal(precioTotal);
    // }

    setCantidadFinal(cantidadTotal);
    setEstadoPedido(0);
  }, [context.actuCarrito]);

  return (
    <div className={style.container} style={{ right: show ? "0px" : "-110vw" }}>
      <div className={style.toast}>
        <Toaster />
      </div>
      <div className={style.toast__movil}>
        <Toaster position="top-center" />
      </div>
      <p onClick={() => showCarrito(false)} className={style.cerrar}>
        X
      </p>{" "}
      <div>
        <h4>Mi carrito</h4>
        <div className={style.lista__productos}>
          {context.carrito &&
            context.carrito.map((item) => {
              return (
                <div className={style.carrito__item} key={item.id}>
                  <Link href={`/productos/${item.id}`} className={style.img}>
                    <img src={item.img} alt="" />
                  </Link>

                  <div className={style.carrito__desc}>
                    <Link
                      href={`/productos/${item.id}`}
                      className={style.carrito__title}
                    >
                      {item.title}
                    </Link>

                    <div className={style.carrito__cantidad}>
                      <p
                        className={style.icon}
                        onClick={() => restarCantidad(item.id)}
                      >
                        -
                      </p>
                      <p className={style.cant}>{item.cantidad}</p>
                      <p
                        className={style.icon}
                        onClick={() => sumarCantidad(item.id)}
                      >
                        +
                      </p>
                    </div>
                  </div>
                  <div className={style.carrito__precio}>
                    <p>${item.cantidad * item.precio}</p>
                    <MdOutlineDeleteOutline
                      onClick={() => eliminarProducto(item.id)}
                      className={style.carrito__icon}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div className={style.cupon} onClick={() => setShowCupon(!showCupon)}>
          <p>¿Tenes un Cupon?</p>
          {showCupon ? (
            <MdOutlineKeyboardArrowUp className={style.icon} />
          ) : (
            <MdKeyboardArrowDown className={style.icon} />
          )}
        </div>

        {showCupon && (
          <>
            {cuponActivo && cuponActivo.activo ? (
              <p className={style.cupon__aplicado}>
                Cupon aplicado de {cuponActivo.monto}%
              </p>
            ) : (
              <form
                action=""
                onSubmit={aplicarCupon}
                className={style.form__cupon}
              >
                <input
                  type="text"
                  id="inputCupon"
                  placeholder="Ingrese el cupon"
                  required
                />
                <button type="submit">Aplicar Cupon</button>
              </form>
            )}
          </>
        )}
        <div className={style.precio__final}>
          <p>Total:</p>
          <p>${precioFinal}</p>
        </div>

        {/* {cantidadFinal >= 4 && (
          <p>
            Descuento aplicado de <span>$60</span> por par. Total:{" "}
            <span>${cantidadFinal * 60}</span>
          </p>
        )} */}

        <div className={style.container__confirmacion}>
          {estadoPedido == 0 && (
            <div
              onClick={() => setEstadoPedido(1)}
              className={style.confirmacion}
            >
              <p>Realizar Pedido</p>
            </div>
          )}

          {estadoPedido == 1 && (
            <div onClick={confirmarPedido} className={style.confirmacion}>
              <p>Confirmar Pedido</p>
            </div>
          )}

          {estadoPedido == 2 && (
            <div
              className={style.confirmacion}
              style={{ backgroundColor: "rgb(2, 190, 18)" }}
            >
              <a
                href={`https://api.whatsapp.com/send?phone=5493794636543&text=${pedido}`}
                target={"_blank"}
              >
                Ir a WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;
