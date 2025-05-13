# ios/pod_wrapper.rb

require 'logger'                       # <- виправляє Logger помилку
require 'cocoapods'
require 'cocoapods/config'            # <- виправляє Config помилку
require 'cocoapods/command'

# Запускаємо pod
Pod::Command.run(ARGV)
