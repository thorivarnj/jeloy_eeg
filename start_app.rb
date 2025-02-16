def parse_lsof(input)
  # Split the output into lines
  lines = input.split("\n")
  
  # Extract the headers
  headers = lines.shift.split
  
  # Parse each line into a hash
  results = lines.map do |line|
    values = line.split
    headers.zip(values).to_h
  end

  return results[0]["PID"]
end


def check_port_availability(port)
  return `lsof -i :#{port}`
end

def kill_process(pid)
  puts "trying to kill process with pid: #{pid}" 
  result = `kill -9 #{pid}`
end

def kill_bluetooth_driver
  puts "Killing bluetooth driver"
  kill_bt = `sudo pkill bluetoothd`

  if kill_bt.length > 1
    puts "Error killing bluetooth driver, please try again" 
  end
end


def force_run_python_script(script_name)
  puts "Running python script"
  run_script = `python3 #{script_name}`

  loop do 
    run_script = `python3 #{script_name}`
    puts "test loopo" +  run_script
  break unless
    run_script.match(/^Traceback/) 
  end
end


while check_port_availability 5173
  result = check_port_availability 5173
  puts result

  if result.length < 1
    break
  end

  puts result
  pid = parse_lsof result
  puts pid
  kill_process pid
end

kill_bluetooth_driver

force_run_python_script "app.py"

