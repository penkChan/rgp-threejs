import { useEffect, useMemo } from "react";
import { Subject } from "rxjs";

export function useDestorySubject() {
  const destorySubject$ = useMemo(() => new Subject<void>(), []);
  useEffect(() => {
    return () => {
      destorySubject$.next();
      destorySubject$.complete();
    };
  }, [destorySubject$]);
  return destorySubject$;
}
