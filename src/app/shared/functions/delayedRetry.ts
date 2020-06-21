import { Observable, of, throwError } from 'rxjs';
import { mergeMap, delay, retryWhen } from 'rxjs/operators';

const getErrorMessage = (maxRetry: number) => `Tried to load Resource for ${maxRetry} times without succecc. Giving up.`;

const DEFAULT_MAX_RETRIES = 5;

export function delayedRetry(delayedMs: number, maxRetry = DEFAULT_MAX_RETRIES) {
    let retries = maxRetry;

    return (src: Observable<any>) =>
        src.pipe(
            retryWhen((errors: Observable<any>) => errors.pipe(
                delay(delayedMs),
                mergeMap(error => retries-- > 0 ? of(error) : throwError(getErrorMessage(maxRetry))
            ))
        )
    );
}