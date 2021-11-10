<?php

use App\Kernel;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

dd(array_filter($_SERVER, function($item) {
	return str_contains($item, 'MERCURE');
}, ARRAY_FILTER_USE_KEY));

return function (array $context) {
	return new Kernel($context['APP_ENV'], (bool)$context['APP_DEBUG']);
};
