import bcrypt from 'bcryptjs';


const hashedPassword = async () => {
    const hashedPassword = await bcrypt.hash("Mamdouh123!!!", 10);
    console.log(hashedPassword);
    return hashedPassword
}

hashedPassword()
