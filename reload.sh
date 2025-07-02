cp frontend_nginx /etc/nginx/sites-available/frontend
sudo nginx -t
sudo systemctl restart nginx

cp api.service /etc/systemd/system/api.service
sudo systemctl stop api.service
sudo systemctl daemon-reload
sudo systemctl enable api.service
sudo systemctl start api.service