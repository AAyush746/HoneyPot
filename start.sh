#!/bin/bash
# ONE-CLICK HONEYPOT LAUNCHER
# Works on Kali/Ubuntu/Debian

echo "Starting Honeypot Project (API + Honeypot + Dashboard)"

# Kill any old processes on ports 8000, 2222, 5173
echo "Cleaning old processes..."
killall python 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a sec
sleep 2

# Start Backend API
echo "Starting API on http://localhost:8000"
cd backend
source venv/bin/activate
python api.py &
API_PID=$!
sleep 3

# Start Honeypot (port 2222)
echo "Starting Fake SSH Honeypot on port 2222"
python honeypot.py &
HONEYPOT_PID=$!
sleep 2

# Start Dashboard
echo "Starting Live Dashboard → Opening in browser..."
cd ../dashboard
npm run dev &
DASHBOARD_PID=$!

# Final message
echo ""
echo "ALL SYSTEMS RUNNING!"
echo "   Dashboard → http://localhost:5173"
echo "   API        → http://localhost:8000"
echo "   Honeypot   → Listening on port 2222"
echo ""
echo "Expose port 2222 to the internet → watch real attacks in minutes!"
echo ""
echo "To stop: Press Ctrl+C or run: kill $API_PID $HONEYPOT_PID $DASHBOARD_PID"

# Keep script alive
wait
