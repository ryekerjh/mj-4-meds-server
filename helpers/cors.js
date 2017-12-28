import cors from 'cors';    

export function configCors(app) {
    const corsHostnameWhitelist = [/http:\/\/localhost(?::\d{1,5})?$/];     
    app.use(cors({
      origin: corsHostnameWhitelist,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    return app
}