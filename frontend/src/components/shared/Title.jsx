import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({ title =  "Chat", Description =  "welcome to the chat app" }) => {

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={Description} />
    </Helmet>
  );
};

export default Title;
