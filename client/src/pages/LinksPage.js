import React, { useCallback, useContext, useEffect, useState } from "react";
import ListLinks from "../components/ListLinks";
import Louder from "../components/Louder";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

function LinksPage() {
  const [links, setLinks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request("/api/link", "GET", null, {
        Authorization: token,
      });
      setLinks(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return <Louder />;
  }

  return <div>{!loading && <ListLinks links={links} />}</div>;
}

export default LinksPage;
