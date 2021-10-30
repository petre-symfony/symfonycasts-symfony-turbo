<?php
namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class TurboFrameRedirectSubscriber implements EventSubscriberInterface {
	public function onKernelResponse(ResponseEvent $event){
		if (!$this->shouldWrapRedirect($event->getRequest(), $event->getResponse())) {
			return;
		}
	}

	public static function getSubscribedEvents() {
		return [
			ResponseEvent::class => 'onKernelResponse'
		];
	}

	private function shouldWrapRedirect(Request $request, Response $response):bool {

	}

}