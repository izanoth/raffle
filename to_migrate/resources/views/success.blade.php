<!DOCTYPE html>
<html>

<head>
	<meta name="title" content="Ivan Cilento aka Zanoth">
	<meta name="description" content="">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="Unknown">
	<meta name="keywords" content="" />

	<link rel="stylesheet" href="{{ asset('assets/css_app-8i3os-Xu.css') }}" />

	<style>
		body {
			text-align: center;
			color: black;
		}

		.inner {
			padding-top: 30px;
			color: #ffffff
		}

		.inner [type='submit'] {
			background-color: #9f2121;
			border-radius: 5px;
			color: #e9e9e9;
			font-size: 18px;

			padding: 10px;
			transition: 2s background-color, color;
		}

		.inner [type='submit']:hover {
			background-color: #e9e9e9;
			color: #9f2121;
		}

		.inner button {
			background-color: #9f2121;
			border-radius: 15px;
			color: #e9e9e9;
			font-size: 18px;

			padding: 10px;
			transition: 2s background-color, color;
		}

		.inner button:hover {
			background-color: #e9e9e9;
			color: #9f2121;
		}

	

		p.mask {
			background: url(img/mask.png) 0 0 / cover repeat;
			color: #de466c;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		.tokbg {
			background-image: url('img/maskbg2.png');
			background-repeat: repeat;
			color: white;
			width: 320px;
			margin: auto;
			text-align: center;
		}

		.tokbg img {
			mix-tokbg-mode: lighten;
		}

		.parent {
			width: 100%;
		}
		.fix {
			position: absolute;
			top: 0;
			
		}
	</style>
</head>

<body>
	<div class="fix">
		<div class="container" style="padding-top:10px;padding-bottom:10px;">
			Nós já lhe enviamos um e-mail de confirmação.
			<div class="inner tokbg"
				style="padding-bottom:10px;text-align:center;margin-bottom:10px;border-radius:30px;">

				<table class='' style='color:#000;font-weight:900;width:100%;position:relative;text-align:center;'>
					<tr>
						<td style='font-size:12px;'>Nome: {{ $name }} </td>
						<td style='font-size:12px;'>Data :
							<?= now()->format('d/m/Y'); ?>
						</td>
					</tr>
					<tr>
						<td colspan='2' style='padding:10px;font-size:12px;'>Sorteio: 000000001</td>
					</tr>
					@foreach (json_decode($tickets) as $item)
					<tr>
						<td colspan='2' style='text-align:center;font-size:32px;text-shadow:1px 1px 2px dark;'>
							<p class='mask'>{{ $item }}</p>
						</td>
					</tr>
					@endforeach
				</table>

			</div>

			<div class="container" style="text-align:center;">
				<small>Dúvidas entrar em contato pelo e-mail contato@rifart.com.br </small>
			</div>
			<div class="container">
				<img style="display:block;margin-left:auto;margin-right:auto;" width="auto" height="60px"
					src="{{ asset('img/rifa.png') }}">
			</div>
		</div>
	</div>
</body>
</html>