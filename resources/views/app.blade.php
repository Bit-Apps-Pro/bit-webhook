<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description"
    content="a simple test software for incoming and outgoing webhooks. It allows you to quickly test and debug webhooks by providing a public endpoint for your webhooks to be sent to.">

  <title inertia>Test your webhook - {{ config('app.name', 'Laravel') }}</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

  <!-- Scripts -->
  @routes
  @viteReactRefresh
  @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @if (Request::is('/'))
    @php($__inertiaSsr = null)
  @endif
  @inertia
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-3DVW8ZR3Z1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    // gtag('config', 'G-3DVW8ZR3Z1');
    gtag('config', 'AW-739746057');
  </script>
</body>

</html>
