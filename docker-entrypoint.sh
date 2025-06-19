#!/bin/sh
# Write env vars to .env file for React build
cat <<EOF > .env
REACT_APP_API_URL=$REACT_APP_API_URL
REACT_APP_BASE_URL=$REACT_APP_BASE_URL
REACT_APP_WS_URL=$REACT_APP_WS_URL
REACT_APP_THEME_API_URL=$REACT_APP_THEME_API_URL
REACT_APP_I18N_CONFIG_KEY=$REACT_APP_I18N_CONFIG_KEY
REACT_APP_BASE_LAYOUT_CONFIG_KEY=$REACT_APP_BASE_LAYOUT_CONFIG_KEY
EOF

# Build the React app
npm run build

# Copy build output to nginx html directory
cp -r build/* /usr/share/nginx/html/

# Start nginx
nginx -g "daemon off;"
