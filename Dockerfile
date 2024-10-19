# Usa un'immagine di base di nginx
FROM nginx:alpine

# Copia il sito web nella cartella di nginx
COPY . /usr/share/nginx/html

# Espone la porta 80
EXPOSE 80

# Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]