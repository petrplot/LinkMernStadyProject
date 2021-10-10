import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinkCard from "../components/LinkCard";
import Louder from "../components/Louder";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

function DetailPage() {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [link, setLink] = useState(null);
  const linkId = useParams().id;
  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, "GET", null, {
        Authorization: token,
      });
      setLink(fetched);
    } catch (e) {}
  }, [token, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);

  if (loading) {
    return <Louder />;
  }

  return <>{!loading && link && <LinkCard link={link} />}</>;
}

export default DetailPage;
