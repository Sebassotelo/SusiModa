import React, { useEffect, useState } from "react";
import ContextPrincipal from "./contextPrincipal";
import firebaseApp from "./firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function Context(props) {
  const [productos, setProductos] = useState([]);
  const [productosCopia, setProductosCopia] = useState([]);
  const [productosPublicos, setProductosPublicos] = useState([]);
  const [productosPublicosCopia, setProductosPublicosCopia] = useState([]);
  const [contadorOfert, setContadorOfert] = useState(0);
  const [cupones, setCupones] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [secciones, setSecciones] = useState([]);
  const [estadoUsuario, setEstadoUsuario] = useState(0);

  // 0 = No logueado
  // 1 = Logueado
  const [user, setUser] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [actuCarrito, setActuCarrito] = useState(false);
  const [loader, setLoader] = useState(false);
  const urlLogo = "https://i.imgur.com/zy1Xa6q.png";

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  const inspectorSesion = (usuarioFirebase) => {
    //en caso de que haya seison iniciada
    if (usuarioFirebase) {
      setUser(usuarioFirebase);
      if (
        usuarioFirebase.email == "sebassotelo97@gmail.com" ||
        usuarioFirebase.email == "susi.modaa@gmail.com"
      ) {
        setEstadoUsuario(1);
        setUser(usuarioFirebase);
      }
    } else {
      //en caso de que haya seison iniciada
      setUser(null);
      setEstadoUsuario(0);
    }
  };
  const verificarLogin = () => {
    onAuthStateChanged(auth, inspectorSesion);
  };

  const llamadaDB = async () => {
    setLoader(false);
    const docRef = doc(firestore, `users/sebassotelo97@gmail.com`);
    const consulta = await getDoc(docRef);
    const infoDocu = consulta.data();
    setProductos(infoDocu.items);
    setProductosCopia(infoDocu.items);
    setCupones(infoDocu.cupones);
    recuperarStorage();

    const array = infoDocu.items.filter((item) => item.stock > 0);

    setProductosPublicos(array);
    setProductosPublicosCopia(array);
    setSecciones(infoDocu.secciones);

    const nuevoArray = array.filter((e) => e.descuento);
    setContadorOfert(nuevoArray.length);

    // setProductos(infoDocu.noticias);
    setLoader(true);
  };

  const actualizacionCarrito = () => {
    setActuCarrito(!actuCarrito);
  };

  const setearLocalStorage = () => {
    localStorage.setItem("carritoSusi", JSON.stringify(carrito));
  };

  const recuperarStorage = () => {
    // Obtener la cadena de texto guardada en el localStorage con la clave "carrito"
    const carritoString = localStorage.getItem("carritoSusi");

    // Si existe la cadena de texto, convertirla en un objeto del carrito
    if (carritoString) {
      setCarrito(JSON.parse(carritoString));
      setActuCarrito(!actuCarrito);
    }
    // Si no hay valor en localStorage, devolver un objeto vacío
    return [];
  };

  const [prevCarritoLength, setPrevCarritoLength] = useState(carrito.length);

  useEffect(() => {
    if (prevCarritoLength >= 1 && carrito.length >= 0) {
      setearLocalStorage();
    }
    setPrevCarritoLength(carrito.length);
  }, [carrito, carrito.map((item) => item.cantidad)]);

  return (
    <ContextPrincipal.Provider
      value={{
        productos: productos,
        productosCopia: productosCopia,
        productosPublicos: productosPublicos,
        productosPublicosCopia: productosPublicosCopia,
        contadorOfert: contadorOfert,
        cupones: cupones,
        estadoUsuario: estadoUsuario,
        loader: loader,
        auth: auth,
        firestore: firestore,
        user: user,
        secciones: secciones,
        carrito: carrito,
        actuCarrito: actuCarrito,
        busqueda: busqueda,
        urlLogo: urlLogo,
        setSecciones,
        setProductos,
        setProductosCopia,
        llamadaDB,
        inspectorSesion,
        setLoader,
        setCarrito,
        actualizacionCarrito,
        setProductosPublicos,
        setProductosPublicosCopia,
        verificarLogin,
        setCupones,
        setBusqueda,
      }}
    >
      {props.children}
    </ContextPrincipal.Provider>
  );
}

export default Context;
