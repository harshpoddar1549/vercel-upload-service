let hashMap = process.env.HASHMAP_SIZE && Array(parseInt(process.env.HASHMAP_SIZE)).fill([])

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const sessionGenerator = ():string => {
    /* 
        This will create the random session string,
        Check if it exists or not,
        if not return it
        else, generate again
    */
    const session = randomStringGenerator()
    return session
}

const randomStringGenerator = ():string => {
    /*
        It simply generates a random sting 
     */
    let randomString = ""
    let sessionStringLength = process.env.SESSION_STRING_LENGTH ? 
                                parseInt(process.env.SESSION_STRING_LENGTH) : 6
    for (let i =0 ; i<sessionStringLength; i++){
        const index = Math.floor(Math.random()*characters.length)
        randomString = randomString + characters[index]
    }
    return randomString
}

const sessionExists = (session:string) => {
    /* 
    It looks for the session in the hashMap
    How?
    1. Generate the hashValue
    2. if(session in hashMap[hashValue])
    3. return true else false
     */
}

const hashFunction = (session:string):number => {
    /* This function will take the session Id, bunch of characters, add there ascii value and  
        do a mod with the HASHMAP_SIZE, better use a prime number and return the hasValue
    */
    return 23
}

