// The shape a page arrives in: the same head block at the same size, in the same
// container, so nothing moves when the real one lands.
export default function RouteFallback() {
  return (
    <main id="main" aria-hidden="true" aria-busy="true">
      <header className="pb-14 pt-[calc(62px+clamp(3rem,9vh,6rem))] sm:pb-20 lg:pt-[calc(74px+clamp(3rem,9vh,6rem))]">
        <div className="shell">
          <div aria-hidden="true" className="h-[10px] w-24 bg-bone-100/12" />
          <div
            aria-hidden="true"
            className="mt-6 h-[clamp(2.8rem,11vw,7rem)] w-[min(70%,44rem)] bg-bone-100/[0.07]"
          />
          <div className="mt-8 h-4 w-[min(90%,36rem)] bg-bone-100/[0.05]" />
          <div className="mt-3 h-4 w-[min(70%,28rem)] bg-bone-100/[0.05]" />
        </div>
      </header>
      <div className="shell">
        <div className="h-40 w-full bg-bone-100/[0.04]" />
      </div>
    </main>
  );
}
