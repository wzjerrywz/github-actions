
export class Tool {
       static smap(...rest: Array<string>) {
            // ['a', 1, 'b', 2, 'c', 3] 构造成map， 
            // 索引 奇数是key，偶数是value
            // const arr = ['a', '1', 'b', '2', 'c', '3'];
            const map: Map<string, string> = new Map();
            for (let i = 0; i < rest.length; i += 2) {
                map.set(rest[i], rest[i + 1]);
            }
            return map;
       }     
} ;