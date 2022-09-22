/** @jsxImportSource @emotion/react */
import "./styles.css";
import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const Counter = () => {
  const [value, setValue] = useState<number>(0);

  const handleInc = () => setValue((prev: number) => ++prev);

  return (
    <button css={{ background: "blue" }} onClick={handleInc}>
      Click me ({value})
    </button>
  );
};

function ShadowComponent() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [portalDestination, setPortalDestination] = useState<HTMLDivElement>();
  const [cache, setCache] = useState<EmotionCache>();

  useEffect(() => {
    if (!hostRef.current) throw new Error("hostRef.current is null.");

    const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
    const myPortalDestination = document.createElement("div");
    shadowRoot.append(myPortalDestination);
    setPortalDestination(myPortalDestination);

    setCache(
      createCache({
        key: "shadow-css",
        container: myPortalDestination
      })
    );
  }, []);

  const shadowContent = cache && (
    <CacheProvider value={cache}>
      <div css={{ color: "red" }}>This text should be red</div>
      <Counter />
    </CacheProvider>
  );

  return (
    <div>
      <div ref={hostRef} className="ok" />
      {portalDestination &&
        ReactDOM.createPortal(shadowContent, portalDestination)}
    </div>
  );
}

const App: React.VFC = () => {
  const [mountShadowComponent, setMountShadowComponent] = useState(true);

  return (
    <div>
      <button type="button" onClick={() => setMountShadowComponent((b) => !b)}>
        Toggle mountShadowComponent
      </button>
      <br />
      <br />
      {mountShadowComponent && <ShadowComponent />}
    </div>
  );
};

export default App;
