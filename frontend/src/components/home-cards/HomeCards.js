import React from "react";
import { MdFindReplace } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { GiLovers } from "react-icons/gi";
import { LuHeartHandshake } from "react-icons/lu";

import "./HomeCards.css";

const HomeCards = () => {
  const cardItems = [
    {
      logo: <MdFindReplace size={40} />,
      title: "Discover Your Forever",
      description: "Where Hearts Connect and Love Stories Unfold.",
    },
    {
      logo: <ImProfile size={40} />,
      title: "100% Verified Profiles",
      description:
        "Where Genuine Love Stories Begin. Find Your Perfect Match with Confidence.",
    },
    {
      logo: <GiLovers size={40} />,
      title: "Your Love, Our Priority",
      description:
        "Experience the Joy of Love in an Environment Designed for Authentic Connections.",
    },
    {
      logo: <LuHeartHandshake size={40} />,
      title: "A Journey of Love's Grace",
      description:
        "Be Inspired by 2 Lakhs+ Families Whose Lives Have Been Enriched Over 23 Beautiful Years.",
    },
  ];
  return (
    <div className="cards-container">
      {cardItems.map((item) => (
        <div className="cards" key={item.title}>
          <div className="cards-icon">{item.logo}</div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HomeCards;
