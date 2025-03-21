


export function generateID() {

    const superset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const lenght = 5;
    let id = "";

    for (let i = 0; i < lenght; i++) 
    {
        id += superset[Math.floor(Math.random() * superset.length)];
    }
    
    return id;

}