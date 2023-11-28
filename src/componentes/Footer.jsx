import React from "react";
import style from "../styles/Footer.module.scss";
import {
  AiOutlineInstagram,
  AiOutlineWhatsApp,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";

import { useRouter } from "next/router";

function Footer() {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <footer className={style.container}>
      {!currentPath.includes("panel-de-control") && (
        <div className={style.footer}>
          <div className={style.text}>
            <h3>MEDIOS DE PAGO</h3>
            <p>Transferencias y Efectivo</p>
            <h3>MEDIOS DE ENVIOS</h3>
            <p>🚐Hacemos envíos</p>
          </div>
          <div className={style.contacto}>
            <h3>NUESTRAS REDES SOCIALES</h3>
            <div className={style.icon__container}>
              <a
                href="https://www.instagram.com/sagi_lenceria"
                target={"_blank"}
              >
                <AiOutlineInstagram className={style.icon} />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=5493794256715&type=phone_number&app_absent=0"
                target={"_blank"}
              >
                <AiOutlineWhatsApp className={style.icon} />
              </a>
            </div>
            <h3>CONTACTO</h3>
            {/* <div className={style.contacto__item}>
            <AiOutlineMail />
            <a href="">sras.medias22@gmail.com</a>
          </div> */}
            <div className={style.contacto__item}>
              <AiOutlinePhone />
              <p>379-4256715</p>
            </div>
            <div className={style.contacto__item}>
              <FaMapMarkerAlt /> <p href="">Corrientes -Capital</p>
            </div>
          </div>
        </div>
      )}
      <p className={style.p}>
        Hecho por{" "}
        <a href="https://www.sebassotelo.com.ar/" target={"_blank"}>
          Sebas Sotelo
        </a>{" "}
      </p>
    </footer>
  );
}

export default Footer;
