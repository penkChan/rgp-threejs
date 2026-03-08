import { Observable } from "rxjs";

/**
 * 基于 ResizeObserver 封装的工具函数
 * 调用后返回一个 Observable，在订阅时创建并启动 ResizeObserver，取消订阅时自动断开。
 *
 * 使用方式（示例）:
 * const resize$ = createResizeObserver(element);
 * const sub = resize$.subscribe((entry) => {
 *   const { width, height } = entry.contentRect;
 *   // do something...
 * });
 * // 不用了时：sub.unsubscribe();
 */
export function createResizeObserver(
  target: Element,
): Observable<ResizeObserverEntry> {
  return new Observable<ResizeObserverEntry>((subscriber) => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 将本次变更的所有 entry 逐个推送出去
        subscriber.next(entry);
      }
    });

    observer.observe(target);

    // teardown：当所有订阅者都取消订阅时会调用
    return () => {
      observer.disconnect();
      subscriber.complete();
    };
  });
}