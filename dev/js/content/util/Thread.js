export class Thread
{
    static sleep(milSec = 1000) {
        return new Promise(r => setTimeout(r, milSec));
    }
}